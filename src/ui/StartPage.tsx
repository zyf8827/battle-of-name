import { useState } from 'react';

import { useBattleStore } from '../store/battleStore';

export function StartPage() {
  const nameA = useBattleStore((state) => state.nameA);
  const nameB = useBattleStore((state) => state.nameB);
  const setNameA = useBattleStore((state) => state.setNameA);
  const setNameB = useBattleStore((state) => state.setNameB);
  const startBattle = useBattleStore((state) => state.startBattle);

  const [error, setError] = useState('');
  const [showSeedInput, setShowSeedInput] = useState(false);
  const [replaySeed, setReplaySeed] = useState('');

  const onStart = () => {
    if (!nameA.trim() || !nameB.trim()) {
      setError('请输入两个姓名后再开始对战。');
      return;
    }
    setError('');
    startBattle(showSeedInput ? replaySeed : undefined);
  };

  return (
    <section className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col items-center justify-center px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-950 to-slate-950"></div>

      <button
        onClick={() => setShowSeedInput((value) => !value)}
        className="absolute right-4 top-4 rounded-full border border-slate-700 bg-slate-900/50 px-4 py-1.5 text-xs font-medium text-slate-400 backdrop-blur transition hover:bg-slate-800 hover:text-slate-200"
      >
        {showSeedInput ? '隐藏种子' : '回放种子'}
      </button>

      <div className="w-full max-w-2xl rounded-3xl border border-slate-700/50 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md md:p-12">
        <div className="mb-10 text-center">
          <h1 className="mb-3 text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 drop-shadow-sm">
            姓名大作战
          </h1>
          <p className="text-sm font-medium text-slate-400">
            输入姓名，启动一场<span className="text-sky-400">随机</span>且
            <span className="text-indigo-400">独特</span>的文字直播对战
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 opacity-30 blur transition duration-500 group-hover:opacity-70"></div>
            <input
              value={nameA}
              onChange={(event) => setNameA(event.target.value)}
              placeholder="输入姓名 A"
              className="relative w-full rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-lg text-slate-100 placeholder-slate-600 outline-none transition focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-50">
              🥷
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 opacity-30 blur transition duration-500 group-hover:opacity-70"></div>
            <input
              value={nameB}
              onChange={(event) => setNameB(event.target.value)}
              placeholder="输入姓名 B"
              className="relative w-full rounded-xl border border-slate-700 bg-slate-950 px-5 py-4 text-lg text-slate-100 placeholder-slate-600 outline-none transition focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xl opacity-50">
              🧙‍♂️
            </div>
          </div>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${showSeedInput ? 'max-h-24 mt-6 opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <div className="relative">
            <input
              value={replaySeed}
              onChange={(event) => setReplaySeed(event.target.value)}
              placeholder="输入种子进行回放 (可选)"
              className="w-full rounded-xl border border-amber-500/30 bg-slate-950/50 px-5 py-3 text-sm text-slate-200 placeholder-slate-600 outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-amber-500/50 font-mono">
              种子
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <button
            onClick={onStart}
            className="group relative w-full overflow-hidden rounded-xl bg-slate-100 px-8 py-4 text-center font-bold text-slate-900 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] transition-transform active:scale-[0.98] md:w-auto md:min-w-[200px]"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              🚀 开始对战
            </span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 opacity-0 transition-opacity group-hover:opacity-100"></div>
          </button>

          {error && (
            <p className="animate-bounce text-sm font-medium text-rose-400">
              ⚠️ {error}
            </p>
          )}
        </div>
      </div>

      <footer className="mt-8 flex flex-col items-center gap-2 text-xs text-slate-600">
        <p>v0.1.0 · Battle of Name</p>
        <a
          href="https://github.com/zyf8827/battle-of-name"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-slate-400 transition-colors"
        >
          源代码
        </a>
      </footer>
    </section>
  );
}
