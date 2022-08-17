import React, { useState, useCallback, useEffect } from 'react';

import Header from '@/components/Header';

import classnames from 'classnames';
import { providers, utils, bcs, encoding } from '@starcoin/starcoin';
import StarMaskOnboarding from '@starcoin/starmask-onboarding';

const { isStarMaskInstalled } = StarMaskOnboarding;

const currentUrl = new URL(window.location.href);

const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? 'http://localhost:8000' : undefined;

const onboarding = new StarMaskOnboarding({ forwarderOrigin });

export let starcoinProvider;

export default function IndexPage() {
  // 鼠标是否hover了connect按钮
  const [connectOver, setOver] = useState(false);
  // 是否已连接账户
  const [isStarMaskConnected, setConnected] = useState(false);
  // 已连接账户
  const [account, setAccount] = useState([]);

  const [isInstall, setInstall] = useState(true);

  const freshConnected = useCallback(async () => {
    const newAccounts = await window.starcoin.request({
      method: 'stc_requestAccounts',
    });
    console.log(newAccounts);
    setAccount([...newAccounts]);
    setConnected(newAccounts && newAccounts.length > 0);
  }, []);

  useEffect(() => {
    if (!isStarMaskInstalled()) {
      setInstall(false);
      alert('没有安装 starmask 插件！');
      onboarding.startOnboarding();
    } else {
      setInstall(true);
    }
  }, [freshConnected]);

  useEffect(() => {
    try {
      starcoinProvider = new providers.Web3Provider(window.starcoin, 'any');
    } catch {
      setInstall(false);
    }
  }, []);

  const handleClick = useCallback(() => {
    if (isStarMaskConnected) {
      if (onboarding) {
        onboarding.stopOnboarding();
      }
    } else {
      freshConnected();
    }
  }, [freshConnected, isStarMaskConnected]);
  return (
    <>
      <Header></Header>
      <div className="tracking-widest">
        {isInstall && (
          <>
            <div
              className={classnames(
                `flex text-gray-200 bg cursor-pointer bg-slate-800 p-6 justify-center duration-300 hover:bg-slate-900 hover:text-gray-50 text-3xl`,
                'bg-fixed bg-no-repeat bg-cover',
              )}
            >
              Starcoin
            </div>
            <div className=" flex justify-center mt-4">
              <div className="duration-300 sm:min-w-3/4 lg:min-w-1/2 border-2 border-slate-50 shadow-xl p-8 rounded-2xl mb-6 flex justify-center flex-col">
                <div
                  className={classnames(
                    'rounded-2xl text-white font-extrabold p-8 duration-300 flex justify-center',
                    isStarMaskConnected
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-700 hover:bg-blue-900 cursor-pointer',
                  )}
                  onClick={!isStarMaskConnected ? handleClick : null}
                  onMouseOver={() => {
                    setOver(true);
                  }}
                  onMouseLeave={() => {
                    setOver(false);
                  }}
                >
                  <div
                    className={classnames(
                      'duration-500',
                      connectOver && !isStarMaskConnected && 'scale-125',
                    )}
                  >
                    {isStarMaskConnected ? 'Connected' : 'Connect'}
                  </div>
                </div>

                <div
                  className={classnames(
                    'duration-300 h-0 opacity-0',
                    isStarMaskConnected && 'h-screen opacity-100',
                  )}
                >
                  {/* Address */}
                  <div className="rounded-2xl bg-green-100 text-green-600 p-2 mt-4">
                    <div className="font-bold">Current address</div>
                    <div className="flex justify-center">
                      {account.map((t, index) => (
                        <div key={index} className="m-2">
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
