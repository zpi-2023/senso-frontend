import { useRequireHasProfile } from "@/common/identity";

const Page = () => {
  useRequireHasProfile();

  return <>Dashboard</>;
};

export default Page;
