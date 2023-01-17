import { Fragment } from "react"
import { Menu, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import styles from "../styles/Home.module.css"
import { useEffect, useState } from "react"

function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(" ")
}

export default function CategorySelector(props: { onChangeCategory?(arg0: void): void }) {
    const [category, setCategory] = useState("Categories")

    return (
        <Menu as="div" className={props.onChangeCategory ? styles.drawerItem : styles.category}>
            <div>
                <Menu.Button
                    className={
                        props.onChangeCategory
                            ? "inline-flex justify-center rounded text-black-header"
                            : "inline-flex justify-center rounded py-2 text-black-header hover:text-purple-header"
                    }
                >
                    {category}
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
                                                setCategory("Categories")
                                            }
                                            if (props.onChangeCategory) {
                                                props.onChangeCategory()
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
                                <Link legacyBehavior href="/discover/?category=tech">
                                    <a
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:text-purple-header hover:bg-background-header",
                                            "block px-4 py-2 text-lg"
                                        )}
                                        onClick={(e) => {
                                            {
                                                setCategory("Tech")
                                            }
                                            if (props.onChangeCategory) {
                                                props.onChangeCategory()
                                            }
                                        }}
                                    >
                                        Tech
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover/?category=film">
                                    <a
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:text-purple-header hover:bg-background-header",
                                            "block px-4 py-2 text-lg"
                                        )}
                                        onClick={(e) => {
                                            {
                                                setCategory("Film")
                                            }
                                            if (props.onChangeCategory) {
                                                props.onChangeCategory()
                                            }
                                        }}
                                    >
                                        Film
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover/?category=product">
                                    <a
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:text-purple-header hover:bg-background-header",
                                            "block px-4 py-2 text-lg"
                                        )}
                                        onClick={(e) => {
                                            {
                                                setCategory("Product")
                                            }
                                            if (props.onChangeCategory) {
                                                props.onChangeCategory()
                                            }
                                        }}
                                    >
                                        Product
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <Link legacyBehavior href="/discover/?category=gaming">
                                    <a
                                        className={classNames(
                                            active
                                                ? "bg-gray-100 text-gray-900"
                                                : "text-gray-700 hover:text-purple-header hover:bg-background-header",
                                            "block px-4 py-2 text-lg"
                                        )}
                                        onClick={(e) => {
                                            {
                                                setCategory("Gaming")
                                            }
                                            if (props.onChangeCategory) {
                                                props.onChangeCategory()
                                            }
                                        }}
                                    >
                                        Gaming
                                    </a>
                                </Link>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
