import Back from "@/components/Back/Back";
import ProfileCard from "@/components/ProfileCard/ProfileCard";
import Layout from "@/components/layout/Layout";
import ProfileComponent from "@/components/HomeComponent/ProfileComponent";
import axios from "axios";

export default async function Page({ params }) {
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const { slug } = await params;

  const getUserData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/users/${slug}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const user = await getUserData();

  return (
    <Layout>
      {user ? (
        <>
          <Back value={user.full_name} />
          <ProfileCard user={user} />
          <ProfileComponent posts={user.post} user_id={user.id} />
        </>
      ) : (
        <>No user Found</>
      )}
    </Layout>
  );
}
