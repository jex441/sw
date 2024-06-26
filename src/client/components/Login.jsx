import gmailLogo from "../assets/gmail.svg";

const Login = ({ loading }) => {
	if (loading) {
		return "Loading";
	}

	return (
		<>
			<div className="mx-2 lg:mx-auto  block h-[455px] my-10 shadow-lg rounded-lg text-sm flex flex-col items-center p-[40px] lg:w-1/2 bg-white border border-1 border-transparent dark:bg-[#202530] dark:border-[#373D47]">
				<h1 className="font-inter mb-[25px] text-3xl font-bold text-center dark:text-white">
					Vite Template
				</h1>
				<p className="font-inter text-center text-sm leading-6 dark:text-[#8B929F]">
					Welcome to your new Vite App.
				</p>
				<p className="font-inter mb-[60px] text-center dark:text-[#8B929F]">
					Please log in or sign up to continue.
				</p>
				<div className="flex flex-col gap-[20px]">
					<a href="/api/auth/google">
						<div className="flex flex-row w-[310px] space-between rounded-md p-1.5 border  border-[#313131] dark:bg-[#18181B] dark:border-[#373D47] dark:border-2">
							<span className="font-inter w-5/6 ml-4 dark:text-white">
								Continue with Google
							</span>
							<span className="w-1/6  mx-auto flex">
								<img src={gmailLogo} />
							</span>
						</div>
					</a>
				</div>
			</div>
		</>
	);
};

export default Login;
