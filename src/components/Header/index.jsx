import classNames from 'classnames';
import React, { useState, useCallback, useEffect } from 'react';
import logo from './starcoin.png';
import logo1 from './starcoin1.png';
import { providers } from '@starcoin/starcoin';
import StarMaskOnboarding from '@starcoin/starmask-onboarding';

let starcoinProvider;

const currentUrl = new URL(window.location.href);
const forwarderOrigin =
  currentUrl.hostname === 'localhost' ? currentUrl.origin : undefined;

const { isStarMaskInstalled } = StarMaskOnboarding;

const onboarding = new StarMaskOnboarding({ forwarderOrigin });

export default function index() {
  const [isStarMaskConnected, setConnected] = useState(false);

  const [account, setAccount] = useState([]);

  const [network, setNetwork] = useState();

  const [isInstall, setInstall] = useState(true);

  const freshConnected = useCallback(async () => {
    const newAccounts = await window.starcoin.request({
      method: 'stc_requestAccounts',
    });
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
      window.starcoin.on('networkChanged', (network) => {
        setNetwork(network);
      });
      window.starcoin.on('accountsChanged', (accounts) => {
        setAccount([...accounts]);
      });
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

  const showAccount = (str, maxlength = 7) => {
    const length = str.length;
    return str.length > maxlength
      ? str.slice(0, maxlength - 1) + '...' + str.slice(30, length)
      : str;
  };
  return (
    <div>
      <div className="h-16 w-full bg-starcoin-header flex items-center px-10 justify-between">
        <img src={logo} alt="" className="h-10" />
        <div
          className={classNames(
            'text-white text-2xl h-10 flex items-center border border-white border-solid px-14 cursor-pointer',
          )}
          onClick={!isStarMaskConnected ? handleClick : null}
        >
          {isStarMaskConnected ? (
            <>
              <img src={logo1} alt="" className="h-6 mr-4" />
              {showAccount(account[0])}
            </>
          ) : (
            'Connect'
          )}
        </div>
      </div>
    </div>
  );
}
