import { useMemo, useState } from "react";
import { Link } from "react-router";
import Feedback from "../Feedback/Feedback";
import StateMessage from "../StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { ROUTES } from "../../constants/ROUTES";
import { useGabinetes } from "../../hooks/useGabinetes";
import { formatPrice } from "../../utils/format";

const SearchPanel = ({ onClose }) => {
  const [query, setQuery] = useState("");
  const { gabinetes, loading, error } = useGabinetes();
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const results = useMemo(
    () =>
      normalizedQuery
        ? gabinetes.filter((gabinete) =>
            `${gabinete.nombre} ${gabinete.marca}`
              .toLocaleLowerCase()
              .includes(normalizedQuery),
          )
        : [],
    [gabinetes, normalizedQuery],
  );

  return (
    <div className="space-y-4">
      <label htmlFor="navbar-product-search" className="sr-only">
        {MESSAGES.navbarPanels.search}
      </label>
      <input
        id="navbar-product-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={MESSAGES.navbarPanels.searchPlaceholder}
        className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500"
      />
      {error && <Feedback type="error">{error}</Feedback>}
      {loading ? (
        <StateMessage>{MESSAGES.catalog.loading}</StateMessage>
      ) : normalizedQuery && results.length === 0 ? (
        <StateMessage>{MESSAGES.navbarPanels.searchEmpty}</StateMessage>
      ) : !normalizedQuery ? (
        <StateMessage>{MESSAGES.navbarPanels.searchStart}</StateMessage>
      ) : (
        <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
          {results.map((gabinete) => (
            <Link
              key={gabinete.id}
              to={ROUTES.productDetail(gabinete.id)}
              onClick={onClose}
              className="flex items-center justify-between gap-4 p-4 transition hover:bg-neutral-50"
            >
              <div>
                <p className="font-medium text-neutral-900">{gabinete.nombre}</p>
                <p className="mt-1 text-sm text-neutral-500">{gabinete.marca}</p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-neutral-900">
                {formatPrice(gabinete.costoUnitario)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;
