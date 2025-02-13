import Back from "@/components/Back/Back";
import BookmarkComponent from "@/components/HomeComponent/Bookmark";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Zentri - Bookmark",
  description: "Zentri Bookmark Page",
};

export default function Page() {
  return (
    <Layout>
      <Back value="Bookmarks" />
      <BookmarkComponent />
    </Layout>
  );
}
