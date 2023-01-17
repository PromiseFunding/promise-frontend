import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import styles from "../styles/Home.module.css"
import { useEffect, useState } from "react"

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}

export default function SortSelector(props: { onChangeSort?(arg0: void): void }) {
    const [type, setType] = useState("Sort By")

    return (
        <Menu as="div" className={props.onChangeSort ? styles.drawerItem : styles.category}>
            <div>
                <Menu.Button
                    className={
                        props.onChangeSort
                            ? "inline-flex justify-center rounded text-black-header"
                            : "inline-flex justify-center rounded py-2 text-black-header hover:text-purple-header"
                    }
                >
                    {type}
                    <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-100 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover">
                                    <a
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:text-purple-header hover:bg-background-header",
                                            "block px-4 py-2 text-lg"
                                        )}
                                        onClick={(e) => {
                                            {
                                                setType("Sort By")
                                            }
                                            if (props.onChangeSort) {
                                                props.onChangeSort()
                                            }
                                        }}
                                    >
                                        ---
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover/?sortby=promise">
                                    <a
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:text-purple-header hover:bg-background-header",
                                            "block px-4 py-2 text-lg"
                                        )}
                                        onClick={(e) => {
                                            {
                                                setType("Promise Funds")
                                            }
                                            if (props.onChangeSort) {
                                                props.onChangeSort()
                                            }
                                        }}
                                    >
                                        Promise Funds
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover/?sortby=yield">
                                    <a
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:text-purple-header hover:bg-background-header",
                                            "block px-4 py-2 text-lg"
                                        )}
                                        onClick={(e) => {
                                            {
                                                setType("Yield Funds")
                                            }
                                            if (props.onChangeSort) {
                                                props.onChangeSort()
                                            }
                                        }}
                                    >
                                        Yield Funds
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                        {/* <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover/?sortby=top5">
                                    <a

                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:text-purple-header hover:bg-background-header',
                                            'block px-4 py-2 text-lg'
                                        )} onClick={(e) => { if (props.onChangeSort) { props.onChangeSort() } }}
                                    >
                                        Top Fundraisers
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover/?sortby=round">
                                    <a

                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:text-purple-header hover:bg-background-header',
                                            'block px-4 py-2 text-lg'
                                        )} onClick={(e) => { if (props.onChangeSort) { props.onChangeSort() } }}
                                    >
                                        Round
                                    </a>
                                </Link>
                            )}
                        </Menu.Item> */}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
