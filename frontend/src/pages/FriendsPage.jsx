import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api.js";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { UsersIcon } from "lucide-react";

const FriendsPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
              <UsersIcon className="w-8 h-8 text-primary" />
              Your Friends
            </h1>
            <p className="text-base-content/70 mt-2">
              Connect and chat with your language learning partners
            </p>
          </div>
          
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-title">Total Friends</div>
              <div className="stat-value text-primary">{friends.length}</div>
            </div>
          </div>
        </div>

        {/* Friends List */}
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-12">
            <NoFriendsFound />
          </div>
        ) : (
          <>
            {/* Friends Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <FriendCard key={friend._id} friend={friend} />
              ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="font-semibold text-lg">Active Conversations</h3>
                  <p className="text-2xl font-bold text-primary">{friends.length}</p>
                  <p className="text-sm opacity-70">Ready to chat</p>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="font-semibold text-lg">Languages Practiced</h3>
                  <p className="text-2xl font-bold text-secondary">
                    {new Set(friends.map(f => f.nativeLanguage)).size}
                  </p>
                  <p className="text-sm opacity-70">Different native languages</p>
                </div>
              </div>
              
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body text-center">
                  <h3 className="font-semibold text-lg">Learning Together</h3>
                  <p className="text-2xl font-bold text-accent">
                    {new Set(friends.map(f => f.learningLanguage)).size}
                  </p>
                  <p className="text-sm opacity-70">Languages being learned</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
