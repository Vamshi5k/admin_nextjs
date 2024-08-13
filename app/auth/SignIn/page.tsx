const SignIn = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl mb-4">Sign In</h1>
        <form className="flex flex-col space-y-4">
          <input type="email" placeholder="Email" className="border p-2" />
          <input type="password" placeholder="Password" className="border p-2" />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Sign In
          </button>
        </form>
      </div>
    );
  };
  
  export default SignIn;
  