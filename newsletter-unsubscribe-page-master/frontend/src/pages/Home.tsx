import { useState } from "react";
import type { Status } from "../types";
import Loading from "../components/Loading";
import Card from "../components/Card";

const Home = () => {
  const [loading, setLoading] = useState<Status>("initial");

  return (
    <div className="p-6 flex flex-col items-center justify-center gap-6">
      {loading === "loading" ? (
        <Loading />
      ) : (
        <Card loading={loading} setLoading={setLoading} />
      )}
    </div>
  );
};

export default Home;
