import { useRequireLoggedIn } from "@/common/identity";

const Page = () => {
  useRequireLoggedIn();

  return <>Select profile</>;
};

export default Page;
