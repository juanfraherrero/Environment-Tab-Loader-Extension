import { useEffect, useState } from 'react';

export function Cafesito(): JSX.Element {
  const [showButton, setShowButton] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showButton) {
      timer = setTimeout(() => {
        setShowButton(false);
      }, 5000);
    }
    return (): void => clearTimeout(timer);
  }, [showButton]);

  return (
    <div className="relative w-[150px]">
      <img
        id="cafesito-logo"
        src="/cafesito_logo.svg"
        alt="Doná un cafesito"
        className={`absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]
            transition-all duration-500 ${
              showButton ? 'opacity-0 z-0' : 'opacity-100 cursor-pointer z-10'
            }`}
        onClick={() => {
          setShowButton(true);
        }}
      />
      <a
        id="cafesito-button"
        href="http://cafesito.app/juanfraherrero"
        target="_blank"
        rel="noopener"
        className={`relative transition-all duration-500 ${
          showButton ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none'
        }`}
      >
        <img
          srcSet="https://cdn.cafecito.app/imgs/buttons/button_1.png 1x, https://cdn.cafecito.app/imgs/buttons/button_1_2x.png 2x, https://cdn.cafecito.app/imgs/buttons/button_1_3.75x.png 3.75x"
          src="https://cdn.cafecito.app/imgs/buttons/button_3.png"
          alt="Invitame un café en cafecito.app"
        ></img>
      </a>
    </div>
  );
}
