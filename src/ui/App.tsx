import { useBattleStore } from '../store/battleStore';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import { OrientationPrompt } from '../components/OrientationPrompt';
import { BattlePage } from './BattlePage';
import { ResultPage } from './ResultPage';
import { StartPage } from './StartPage';

export default function App() {
  const result = useBattleStore((state) => state.result);
  const phase = useBattleStore((state) => state.phase);

  // 设备检测
  const deviceInfo = useDeviceDetection();

  // 方向提示：仅在移动设备 + 竖屏时显示
  const showOrientationPrompt = deviceInfo.isMobile && deviceInfo.isPortrait;

  // 渲染当前页面
  let currentPage: React.ReactNode;
  if (!result) {
    currentPage = <StartPage />;
  } else if (phase === 'finished') {
    currentPage = <ResultPage />;
  } else {
    currentPage = <BattlePage />;
  }

  return (
    <>
      {currentPage}
      <OrientationPrompt visible={showOrientationPrompt} />
    </>
  );
}
