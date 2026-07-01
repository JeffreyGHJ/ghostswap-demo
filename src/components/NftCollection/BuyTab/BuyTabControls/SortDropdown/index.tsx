import { Menu } from '@headlessui/react'

const btn =
  'flex items-center pl-3 pr-4 justify-between w-[150px] border-2 border-dark-800 rounded-md h-[39.5px] mb-[1px] hover:border-dark-700'
const triangle = 'h-0 w-0 border-[6px] absolute translate-y-[-50%] translate-x-[-25%] border-transparent border-l-white'

const SortDropdown = ({ activeSort, setActiveSort, SORTINGS }) => {
  return (
    <Menu>
      {({ open }) => (
        <div className="flex flex-col">
          <Menu.Button className={btn}>
            {activeSort}
            <div className={'relative' + (open && ' rotate-90 ')}>
              <div className={triangle} />
            </div>
          </Menu.Button>
          <div className="relative z-[99999] ">
            <Menu.Items className={'absolute bg-dark-900 w-full rounded-md overflow-hidden'}>
              {SORTINGS.map((sort, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <div
                      className={'cursor-pointer pl-5 py-2 ' + (active || activeSort === sort ? 'bg-dark-700' : '')}
                      onClick={() => setActiveSort(sort)}
                    >
                      {sort}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </div>
        </div>
      )}
    </Menu>
  )
}

export default SortDropdown
