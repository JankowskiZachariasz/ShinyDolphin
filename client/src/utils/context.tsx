import React, { useState, useEffect, createContext, FC } from "react";

interface IThemeContext {
  isScrollLocked: boolean;
  setIsScrollLocked : (newScrollValue : boolean) => void
}

const defaultState = {
  isScrollLocked: false,
  setIsScrollLocked: ()=>{}
};

export const AppContext = createContext<IThemeContext>(defaultState);

export const ContextProvider = ({ children } : any) => {

  const [isScrollLocked, setIsScrollLocked] = useState(defaultState.isScrollLocked);

  useEffect(() => {
    document.body.className = isScrollLocked ? 'disable-scroll' : 'enable-scroll';
  })

  return <AppContext.Provider value={{ 
      isScrollLocked, 
      setIsScrollLocked 
    }}>
      {children}
    </AppContext.Provider>;
};
