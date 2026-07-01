import Footer from '../../components/Footer'
import Header from '../../components/Header'
import Main from '../../components/Main'
import Banner from '../../components/Banner'
import Popups from '../../components/Popups'
import Cart from '../../components/Cart'

import { useEffect, useState } from 'react'
import {useSelector } from 'react-redux'
import { useWindowSize } from '../../hooks/useWindowSize'

const screenLayout = 'z-0 flex flex-col w-full overflow-y-auto overflow-x-hidden flex-nowrap '

const Layout = ({ children, banner = undefined }) => {
  const { width } = useWindowSize()
  const cartIsOpen = useSelector((state: any) => state.cart.cartIsOpen)
  const [screenMode, setScreenMode] = useState('mobile')
  const [screenHeight, setScreenHeight] = useState('')

  useEffect(() => {
    if (screenMode === 'desktop') {
      setScreenHeight('h-[100vh]')
    } else if (screenMode === 'tablet') {
      setScreenHeight('h-[calc(100vh-3.5rem)]')
    } else if (screenMode === 'mobile') {
      cartIsOpen ? setScreenHeight('h-[calc(100vh-7rem)]') : setScreenHeight('h-[calc(100vh-3.5rem)]')
    }
  }, [screenMode, cartIsOpen])

  useEffect(() => {
    if (width < 768) setScreenMode('mobile')
    else if (width < 1024) setScreenMode('tablet')
    else setScreenMode('desktop')
  }, [width])

  return (
    <div id="layout" className="z-0 flex flex-col w-full overflow-y-auto lg:flex-row">
      <div id="screen-space" className={screenLayout + screenHeight}>
        <Banner />
        <Header />
        <Main>{children}</Main>
        <Popups />
        {/* <Footer /> */}
      </div>
      <Cart />
      <div id="mobile-header-portal" />
    </div>
  )
}

export default Layout
