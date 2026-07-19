import {useMemo} from "react";
import {useTranslation} from "react-i18next";

function Skeleton({rows = 4}) {
  const {t} = useTranslation();
  const facts = t("funFacts", {returnObjects: true});
  const fact = useMemo(() => {
    if (!Array.isArray(facts) || facts.length === 0) {
      return "";
    }
    return facts[0];
  }, [facts]);

  return (
    <div className="skeleton" aria-live="polite" aria-busy="true">
      <div className="skeleton__header">
        <span className="skeleton__pulse skeleton__title" />
        <p>{fact}</p>
      </div>
      {Array.from({length: rows}, (_, index) => (
        <span className="skeleton__pulse skeleton__row" key={index} />
      ))}
    </div>
  );
}

export default Skeleton;
