/**
 * 设备信息类型定义
 * 用于移动端检测和响应式布局
 */
export interface DeviceInfo {
  /** 是否为移动设备（通过 userAgent 检测） */
  isMobile: boolean;

  /** 是否为竖屏模式 */
  isPortrait: boolean;

  /** 设备方向 */
  orientation: 'portrait' | 'landscape';

  /** 屏幕宽度（px） */
  screenWidth: number;

  /** 屏幕高度（px） */
  screenHeight: number;
}

/** 设备断点类型 */
export type DeviceBreakpoint = 'mobile' | 'tablet' | 'desktop';
