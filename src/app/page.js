import HomeComponent from "@/components/HomeComponent/HomeComponent";
import Layout from "@/components/layout/Layout";

export const metadata = {
  title: "Zentri - Home",
  description: "Zentri Home Page",
};

export default async function Home() {
  return (
    <Layout page="Home">
      <HomeComponent />
    </Layout>
  );
}
