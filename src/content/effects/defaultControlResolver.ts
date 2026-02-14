import type { ControlSourceResolver } from '../../engine/contentAdapter';

export const defaultControlSourceResolver: ControlSourceResolver = ({
  actor,
  envModifiers,
}) => {
  const envControl = envModifiers.find((modifier) =>
    modifier.tags?.includes('control'),
  );
  if (envControl) {
    return envControl;
  }
  return actor.modifiers.find((modifier) => modifier.tags?.includes('control'));
};
