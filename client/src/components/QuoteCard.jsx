import {RefreshCcw} from "lucide-react";
import {useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import Card from "./Card.jsx";
import Button from "./Button.jsx";

function QuoteCard() {
  const {t} = useTranslation();
  const quotes = t("quotes", {returnObjects: true});
  const [seed, setSeed] = useState(0);

  const quote = useMemo(() => {
    if (!Array.isArray(quotes) || quotes.length === 0) {
      return "";
    }
    return quotes[seed % quotes.length];
  }, [quotes, seed]);

  return (
    <Card className="quote-card">
      <p>{quote}</p>
      <Button
        icon={<RefreshCcw size={16} />}
        variant="ghost"
        size="sm"
        onClick={() => setSeed(seed + 1)}
      >
        {t("quotes.next")}
      </Button>
    </Card>
  );
}

export default QuoteCard;
