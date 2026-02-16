import { motion } from 'framer-motion';

interface OrientationPromptProps {
  /** 是否显示提示 */
  visible: boolean;
}

/**
 * 方向提示组件
 *
 * 在移动设备竖屏时显示全屏遮罩，引导用户旋转设备
 * 使用 Framer Motion 实现平滑的旋转动画
 *
 * @param visible - 是否显示提示（仅在竖屏 + 移动设备时为 true）
 *
 * @example
 * ```tsx
 * const deviceInfo = useDeviceDetection();
 * const showPrompt = deviceInfo.isMobile && deviceInfo.isPortrait;
 *
 * return <OrientationPrompt visible={showPrompt} />;
 * ```
 */
export function OrientationPrompt({ visible }: OrientationPromptProps) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-sm"
    >
      <div className="flex flex-col items-center gap-6 text-center p-8">
        {/* 旋转动画的手机图标 */}
        <motion.div
          animate={{ rotate: [0, -90, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-8xl"
        >
          📱
        </motion.div>

        {/* 提示文字 */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-100">
            请旋转设备
          </h2>
          <p className="text-slate-400">为了最佳体验，请使用横屏模式</p>
        </div>

        {/* 旋转图标指示 */}
        <motion.div
          animate={{ rotate: [0, -90, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-4xl text-slate-500"
        >
          ↻
        </motion.div>
      </div>
    </motion.div>
  );
}
