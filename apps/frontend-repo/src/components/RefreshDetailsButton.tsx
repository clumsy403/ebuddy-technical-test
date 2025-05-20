"use client";

import { fetchUserDetails } from "@/store/action";
import { useAppDispatch } from "@/store/hooks";
import { Button, CircularProgress } from "@mui/material";

interface RefreshDetailsButtonProps {
    loading: boolean;
}

const RefreshDetailsButton: React.FC<RefreshDetailsButtonProps> = ({
    loading,
}) => {
    const dispatch = useAppDispatch();

    const handleFetchDetails = async () => {
        try {
            await dispatch(fetchUserDetails()).unwrap();
        } catch (err) {
            console.error("Fetch details failed:", err);
        }
    };

    return (
        <Button
            variant="outlined"
            onClick={handleFetchDetails}
            disabled={loading}
        >
            {loading ? <CircularProgress size={24} /> : "Refresh Details"}
        </Button>
    );
};

export default RefreshDetailsButton;
