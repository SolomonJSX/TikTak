import { useQuery } from "@apollo/client";
import { GET_USERS } from "../graphql/queries/GetUsers.ts";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MenuItem from "./MenuItem.tsx";
import { User } from "../gql/graphql.ts";
import MenuItemSuggested from "./MenuItemSuggested.tsx";

interface IUserResponse {
  users: User[];
}

function SideNav() {
  const { data } = useQuery<IUserResponse>(GET_USERS, {})
  const [showAllUsers, setShowAllUsers] = useState<boolean>(false)

  const displayedUsers = showAllUsers ?
    data?.users : data?.users.slice(0, 3);

  return (
    <div id="SideNav" className={[
      useLocation().pathname === "/" ? "lg:w-[310px]" : "lg:w-[220px]",
      "fixed z-20 bg-white pt-[70px] h-full lg:border-r-0 border-r  overflow-auto",
    ].join(" ")}>
      <div className="lg:w-full w-[55px] mx-auto">
        <Link to="/">
          <MenuItem
            iconString="For You"
            colorString="#F02C56"
            sizeString="30"
          />
        </Link>
        <MenuItem
          iconString="Following"
          colorString="#000000"
          sizeString="27"
        />
        <MenuItem iconString="LIVE" colorString="#000000" sizeString="27" />
        <div className="border-b lg:ml-2 mt-2" />
        <div className="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
          Suggested accounts
        </div>
        <div className="lg:hidden block pt-3" />
        <ul>
          {displayedUsers?.map((user) => (
            <li className="cursor-pointer" key={user.id}>
              <Link to={`/profile/${user.id}`}>
                <MenuItemSuggested user={user} />
              </Link>
            </li>
          ))}
        </ul>
        <button
          onClick={() => setShowAllUsers(!showAllUsers)}
          className="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]"
        >
          See more
        </button>
      </div>
    </div>
  );
}

export default SideNav;