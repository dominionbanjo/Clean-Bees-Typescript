interface FormRow {
  type: string;
  name: string;
  defaultValue?: string;
  labelText?: string;
  onChange?: () => void;
}

const FormRow = ({
  type,
  name,
  labelText,
  defaultValue,
  onChange,
}: FormRow) => {
  return (
    <div className="form-row">
      <label className="label" htmlFor={name}>
        {labelText || name}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue || ""}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default FormRow;
