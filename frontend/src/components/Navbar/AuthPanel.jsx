import { useState } from "react";
import AuthForm from "../Auth/AuthForm/AuthForm";
import AuthModeTabs from "../Auth/AuthModeTabs/AuthModeTabs";
import Feedback from "../Feedback/Feedback";
import { LOGIN } from "../../constants/LOGIN";
import useAuthFlow from "../../hooks/useAuthFlow";
import authService from "../../services/authService";

const AuthPanel = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState("login");
  const {
    message,
    error,
    loading,
    actionComplete,
    form,
    onFieldChange,
    resetForm,
    onSubmit,
    showFormAgain,
  } = useAuthFlow({ mode, service: authService, onLoginSuccess });

  const selectMode = (nextMode) => {
    setMode(nextMode);
    resetForm();
  };

  return (
    <div className="space-y-5">
      <AuthModeTabs
        mode={mode}
        onSelectMode={selectMode}
      />
      {message && <Feedback type="success">{message}</Feedback>}
      {error && <Feedback type="error">{error}</Feedback>}
      {actionComplete ? (
        <div className="space-y-3">
          {mode === "register" ? (
            <button
              type="button"
              onClick={() => selectMode("login")}
              className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              {LOGIN.relogin}
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => selectMode("login")}
                className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
              >
                {LOGIN.relogin}
              </button>
              <button
                type="button"
                onClick={showFormAgain}
                className="w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-white"
              >
                {LOGIN.forgot.requestAnother}
              </button>
            </>
          )}
        </div>
      ) : (
        <AuthForm
          idPrefix="navbar-auth"
          mode={mode}
          form={form}
          onFieldChange={onFieldChange}
          onSubmit={onSubmit}
          isLoading={loading}
          hasResetToken={false}
          onForgotPassword={() => selectMode("forgot")}
        />
      )}
      {mode === "forgot" && !actionComplete && (
        <button
          type="button"
          onClick={() => selectMode("login")}
          className="w-full text-center text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          {LOGIN.relogin}
        </button>
      )}
    </div>
  );
};

export default AuthPanel;
