import { Button, HStack } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";

interface GoButtonProps {
    title?: string;
    onClick?: () => void;
}

export const GoButton = ({ title, onClick }: GoButtonProps) => {
    return (
        <HStack>
            <Button onClick={onClick} className="go-button">
                {title}
                <ArrowRight className="go-button-icon" />
            </Button>
        </HStack>
    );
};