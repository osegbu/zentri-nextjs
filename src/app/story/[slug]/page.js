import Back from "@/components/Back/Back";
import Story from "@/components/HomeComponent/Story";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Zentri - Story",
  description: "Zentri Story",
};

export default async function Page({ params }) {
  const { slug } = await params;

  return (
    <Layout>
      <Back value="Post" />
      <Story slug={slug} />
    </Layout>
  );
}
