import HomeComponent from "@/components/HomeComponent/HomeComponent";
import Layout from "@/components/layout/Layout";

export default async function Home() {
  return (
    <Layout page="Home">
      <HomeComponent />
    </Layout>
  );
}
