import type { Modifier, Unit } from './types';

type InventoryLogKey =
  | 'pickupConsumable'
  | 'dropConsumable'
  | 'pickupEquipment'
  | 'replaceEquipment'
  | 'dropEquipment';

type ServiceLogArgs = {
  key: InventoryLogKey;
  variables: Record<string, string | number | undefined>;
  tags: ('env' | 'equip')[];
  actor: Unit;
  target: Unit;
};

type RuntimeServiceDeps = {
  pickRandomFrom: <T>(values: T[], label: string) => T | undefined;
  cloneModifier: <T>(value: T) => T;
  applyModifier: (targetId: string, modifier: Modifier) => void;
  removeModifier: (
    targetId: string,
    modifierId?: string,
    stackKey?: string,
    max?: number,
  ) => number;
  log: (args: ServiceLogArgs) => void;
};

const ENGINE_CONSUMABLE_MAX_CARRY = 3;

function equipmentSlotOf(modifier: Modifier): string | undefined {
  const withSlot = modifier as Modifier & { slot?: string };
  return withSlot.slot;
}

export function grantConsumableWithPolicy(
  deps: RuntimeServiceDeps,
  target: Unit,
  consumableId: string,
): void {
  const current = [...(target.state.consumables ?? [])];
  if (current.includes(consumableId)) {
    return;
  }
  if (current.length >= ENGINE_CONSUMABLE_MAX_CARRY) {
    const dropped = current.shift();
    target.state.consumables = current;
    if (dropped) {
      deps.log({
        key: 'dropConsumable',
        variables: {
          targetName: target.name,
          targetId: target.id,
          itemId: dropped,
          itemName: dropped,
        },
        tags: ['env'],
        actor: target,
        target,
      });
    }
  }
  target.state.consumables = [...(target.state.consumables ?? []), consumableId];
  deps.log({
    key: 'pickupConsumable',
    variables: {
      targetName: target.name,
      targetId: target.id,
      itemId: consumableId,
      itemName: consumableId,
    },
    tags: ['env'],
    actor: target,
    target,
  });
}

export function loseConsumableByIdWithPolicy(
  deps: RuntimeServiceDeps,
  target: Unit,
  consumableId: string,
): boolean {
  const items = [...(target.state.consumables ?? [])];
  const index = items.indexOf(consumableId);
  if (index < 0) return false;
  items.splice(index, 1);
  target.state.consumables = items;
  deps.log({
    key: 'dropConsumable',
    variables: {
      targetName: target.name,
      targetId: target.id,
      itemId: consumableId,
      itemName: consumableId,
    },
    tags: ['env'],
    actor: target,
    target,
  });
  return true;
}

export function loseRandomConsumableWithPolicy(deps: RuntimeServiceDeps, target: Unit): void {
  const items = [...(target.state.consumables ?? [])];
  const dropped = deps.pickRandomFrom(items, 'event.dropConsumable.random');
  if (!dropped) return;
  target.state.consumables = items.filter(
    (itemId, idx) => itemId !== dropped || idx !== items.indexOf(dropped),
  );
  deps.log({
    key: 'dropConsumable',
    variables: {
      targetName: target.name,
      targetId: target.id,
      itemId: dropped,
      itemName: dropped,
    },
    tags: ['env'],
    actor: target,
    target,
  });
}

export function grantEquipmentWithPolicy(
  deps: RuntimeServiceDeps,
  target: Unit,
  equipment: Modifier,
): void {
  const nextEquipment = deps.cloneModifier(equipment);
  const slot = equipmentSlotOf(nextEquipment);
  let replaced: Modifier | undefined;

  if (slot) {
    const index = target.modifiers.findIndex(
      (modifier) => modifier.source === 'EQUIP' && equipmentSlotOf(modifier) === slot,
    );
    if (index >= 0) {
      replaced = target.modifiers[index];
      target.modifiers.splice(index, 1);
    }
  }

  deps.applyModifier(target.id, nextEquipment);

  if (replaced) {
    deps.log({
      key: 'replaceEquipment',
      variables: {
        targetName: target.name,
        targetId: target.id,
        oldEquipmentId: replaced.id,
        oldEquipmentName: replaced.name,
        equipmentId: nextEquipment.id,
        equipmentName: nextEquipment.name,
      },
      tags: ['equip'],
      actor: target,
      target,
    });
    return;
  }

  deps.log({
    key: 'pickupEquipment',
    variables: {
      targetName: target.name,
      targetId: target.id,
      equipmentId: nextEquipment.id,
      equipmentName: nextEquipment.name,
    },
    tags: ['equip'],
    actor: target,
    target,
  });
}

export function loseRandomEquipmentWithPolicy(
  deps: RuntimeServiceDeps,
  target: Unit,
  slot?: 'WEAPON' | 'ARMOR' | 'ACCESSORY',
): void {
  const candidates = target.modifiers.filter((modifier) => {
    if (modifier.source !== 'EQUIP') return false;
    if (!slot) return true;
    return equipmentSlotOf(modifier) === slot;
  });
  const dropped = deps.pickRandomFrom(candidates, 'event.dropEquipment.random');
  if (!dropped) return;
  deps.removeModifier(target.id, dropped.id, dropped.stacking?.stackKey, 1);
  deps.log({
    key: 'dropEquipment',
    variables: {
      targetName: target.name,
      targetId: target.id,
      equipmentId: dropped.id,
      equipmentName: dropped.name,
    },
    tags: ['equip'],
    actor: target,
    target,
  });
}

export function loseEquipmentByIdWithPolicy(
  deps: RuntimeServiceDeps,
  target: Unit,
  equipmentId: string,
): boolean {
  const dropped = target.modifiers.find(
    (modifier) => modifier.source === 'EQUIP' && modifier.id === equipmentId,
  );
  if (!dropped) return false;
  deps.removeModifier(target.id, dropped.id, dropped.stacking?.stackKey, 1);
  deps.log({
    key: 'dropEquipment',
    variables: {
      targetName: target.name,
      targetId: target.id,
      equipmentId: dropped.id,
      equipmentName: dropped.name,
    },
    tags: ['equip'],
    actor: target,
    target,
  });
  return true;
}
