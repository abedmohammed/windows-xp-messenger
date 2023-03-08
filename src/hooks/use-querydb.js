import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useQuerydb = () => {
  const performQuery = async ({
    dbCollection,
    dbField,
    dbOperator = "==",
    dbMatch,
    handleQuery,
  }) => {
    try {
      const q = query(
        collection(db, dbCollection),
        where(dbField, dbOperator, dbMatch)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        handleQuery(doc);
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  return { performQuery };
};

export default useQuerydb;
