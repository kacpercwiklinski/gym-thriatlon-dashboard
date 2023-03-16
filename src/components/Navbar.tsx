import Link from 'next/link'
import React from 'react'

type Props = {}

const Navbar = (props: Props) => {
    return (
        <div className="navbar bg-neutral text-neutral-content">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost normal-case text-xl">Event Trójbojowy</Link>
            </div>
            {/* <div className="flex-none">
                <ul className="menu menu-horizontal my-0 px-2">
                    <li><Link href="/competitors" className="btn btn-ghost normal-case text-md">Zawodnicy</Link></li>
                    <li><Link href="/scores" className="btn btn-ghost normal-case text-md">Wyniki</Link></li>
                </ul>
            </div> */}
        </div>
    )
}

export default Navbar