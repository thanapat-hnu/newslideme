// import "./LoginDriver.css";
function LoginDriver() {
  return (
    <div className="container-loginDriver">
      {/* นามสกุล */}
      <div className="coolinput">
          <label htmlFor="input" className="text">
            นามสกุล :{" "}
          </label>
          <input
            type="text"
            placeholder="นามสกุล..."
            name="lastName"
            className="input"
          />
        </div>
    </div>
  );
}

export default LoginDriver;
