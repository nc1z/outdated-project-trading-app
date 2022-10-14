import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface PlanState {
  plan: string;
  loading: boolean;
}

const PlanContext = createContext<
  [PlanState, React.Dispatch<React.SetStateAction<PlanState>>]
>([{ plan: "none", loading: true }, () => {}]);

export const PlanProvider = ({ children }: any) => {
  // Plan State
  const [currentPlan, setCurrentPlan] = useState<PlanState>({
    plan: "none",
    loading: true,
  });

  const token = localStorage.getItem("token");

  const fetchPlan = async () => {
    const { data: response } = await axios.get(
      "https://tradewise-demo.herokuapp.com/plan"
    );
    if (response) {
      setCurrentPlan({
        plan: response,
        loading: false,
      });
    }
  };

  useEffect(() => {
    if (token) {
      fetchPlan();
    } else {
      setCurrentPlan({
        plan: "none",
        loading: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PlanContext.Provider value={[currentPlan, setCurrentPlan]}>
      {children}
    </PlanContext.Provider>
  );
};

export const UserPlan = () => {
  return useContext(PlanContext);
};
