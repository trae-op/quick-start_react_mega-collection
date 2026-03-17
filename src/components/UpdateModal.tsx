import { useEffect, useState } from "react";
import { cities, ages, type User } from "../data/users";

type AddUserFormValues = {
  name: string;
  age: string;
  city: string;
};

type ModalProps = {
  item: User | null;
  onCancel: () => void;
  onUpdate: (item: { name: string; age: number; city: string }) => void;
};

const createInitialFormValues = ({
  agesOptions,
  cityOptions,
}: {
  agesOptions: number[];
  cityOptions: string[];
}): AddUserFormValues => ({
  name: "",
  age: agesOptions[0] + "",
  city: cityOptions[0] ?? "",
});

function UpdateModal({ onCancel, onUpdate, item }: ModalProps) {
  const [formValues, setFormValues] = useState<AddUserFormValues>(() =>
    createInitialFormValues({ agesOptions: ages, cityOptions: cities }),
  );

  useEffect(() => {
    if (!item) {
      return undefined;
    }

    setFormValues(
      item
        ? {
            name: item.name,
            age: item.age + "",
            city: item.city,
          }
        : createInitialFormValues({ agesOptions: ages, cityOptions: cities }),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancel, item]);

  if (!item) {
    return null;
  }

  const trimmedName = formValues.name.trim();
  const parsedAge = Number(formValues.age);
  const isAgeValid = Number.isInteger(parsedAge) && parsedAge > 0;
  const isFormValid =
    trimmedName.length > 0 && isAgeValid && formValues.city.length > 0;

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isFormValid) {
      return;
    }

    onUpdate({
      name: trimmedName,
      age: parsedAge,
      city: formValues.city,
    });
  };

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl">
        <div>
          <h2 className="text-lg font-semibold text-slate-100">
            {item ? "Update user" : "Add user"}
          </h2>
          <p className="mt-1 text-sm text-slate-300">Update the user details</p>
        </div>

        <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm text-slate-300">
            <span className="mb-1 block font-medium text-slate-100">Name</span>
            <input
              autoFocus
              type="text"
              value={formValues.name}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  name: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500"
              placeholder="Enter a user name"
            />
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-1 block font-medium text-slate-100">Age</span>
            <select
              value={formValues.age}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  age: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500"
            >
              {ages.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm text-slate-300">
            <span className="mb-1 block font-medium text-slate-100">City</span>
            <select
              value={formValues.city}
              onChange={(event) =>
                setFormValues((prev) => ({
                  ...prev,
                  city: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-slate-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 transition hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateModal;
