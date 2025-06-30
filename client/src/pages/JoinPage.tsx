import FormComponent from "@/components/forms/FormComponent";

function JoinPage() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-pink-900/20"></div>
            
            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/5 rounded-full blur-2xl animate-ping"></div>
            
            {/* Main content */}
            <div className="relative z-10 w-full max-w-md px-6">
                <FormComponent />
            </div>
        </div>
    );
}

export default JoinPage;