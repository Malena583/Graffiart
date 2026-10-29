import Feedback from "../Feedback/Feedback";
import Button from "../Button/Button";
import { CONFIGURATOR_TEXTS } from "../../constants/CONFIGURATOR";
import { formatPrice } from "../../utils/format";

const ConfiguratorSummary = ({
  total,
  loading,
  adding,
  error,
  success,
  canAdd,
  step,
  onContinue,
  onAdd,
}) => (
  <div className="fixed right-0 bottom-0 left-0 z-10 border-t border-neutral-200 bg-white px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] sm:px-6">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs text-neutral-500">
          {CONFIGURATOR_TEXTS.estimatedPrice}
        </p>
        <p className="text-lg font-semibold text-neutral-900">
          {loading ? CONFIGURATOR_TEXTS.loading : formatPrice(total)}
        </p>
      </div>
      <div className="flex flex-col items-end gap-2">
        {error && <Feedback type="error">{error}</Feedback>}
        {success && <Feedback type="success">{success}</Feedback>}
        {step === 2 ? (
          <Button type="button" onClick={onContinue} disabled={!canAdd || loading}>
            {CONFIGURATOR_TEXTS.continue}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onAdd}
            disabled={!canAdd || loading || adding}
          >
            {adding ? CONFIGURATOR_TEXTS.adding : CONFIGURATOR_TEXTS.addToCart}
          </Button>
        )}
      </div>
    </div>
  </div>
);

export default ConfiguratorSummary;
