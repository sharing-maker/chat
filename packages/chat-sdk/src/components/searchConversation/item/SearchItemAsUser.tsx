"use client";
import { Avatar } from "antd";
import { ISessionByStatus } from "../../../store/type";
import { highlightSearch } from "../../../utils/common";
import { DChatSDK } from "../../../constants/sdk";

interface SearchItemAsUserProps {
  session: ISessionByStatus;
  searchTerm: string;
}

const SearchItemAsUser = (props: SearchItemAsUserProps) => {
  const { session, searchTerm = "" } = props;

  const ownerName = `${session.owner?.fullName}${
    session.owner?.username ? ` (${session.owner?.username})` : ""
  }`;

  console.log("SearchItemAsUser", session);

  return (
    <div
      key={session.id}
      className="py-3 px-2 flex items-center gap-3 hover:bg-gray-100 hover:rounded-sm cursor-pointer border-b mx-1"
    >
      <Avatar
        size={"large"}
        src={session.owner?.avatar}
        alt={session.owner?.username}
      >
        {session.owner?.fullName.charAt(0).toUpperCase()}
      </Avatar>
      <div className="flex flex-col flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          dangerouslySetInnerHTML={{
            __html: highlightSearch(ownerName, searchTerm),
          }}
        />
      </div>
    </div>
  );
};

export default SearchItemAsUser;
