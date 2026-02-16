import { useState, useEffect } from 'react';
import type { DeviceInfo } from '../types/device';

/**
 * 移动设备 User-Agent 检测正则表达式
 * 覆盖主流移动设备：Android、iOS、BlackBerry、Windows Phone 等
 */
const MOBILE_DEVICE_REGEX =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

/**
 * 设备检测 Hook
 *
 * 功能：
 * - 检测是否为移动设备
 * - 检测屏幕方向（竖屏/横屏）
 * - 监听窗口 resize 和 orientationchange 事件
 * - 返回实时的设备信息
 *
 * @returns DeviceInfo 设备信息对象
 *
 * @example
 * ```tsx
 * const deviceInfo = useDeviceDetection();
 *
 * if (deviceInfo.isMobile && deviceInfo.isPortrait) {
 *   // 显示方向提示
 * }
 * ```
 */
export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(() => {
    // 初始化时立即检测一次
    const isMobile = MOBILE_DEVICE_REGEX.test(navigator.userAgent);
    const width = window.innerWidth;
    const height = window.innerHeight;
    const isPortrait = height > width;

    return {
      isMobile,
      isPortrait,
      orientation: isPortrait ? 'portrait' : 'landscape',
      screenWidth: width,
      screenHeight: height,
    };
  });

  useEffect(() => {
    let timeoutId: number | null = null;

    const handleResize = () => {
      // 使用防抖优化性能（200ms）
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isPortrait = height > width;

        setDeviceInfo((prev) => ({
          ...prev,
          isPortrait,
          orientation: isPortrait ? 'portrait' : 'landscape',
          screenWidth: width,
          screenHeight: height,
        }));
      }, 200);
    };

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize);

    // 监听设备方向变化（移动端）
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}
