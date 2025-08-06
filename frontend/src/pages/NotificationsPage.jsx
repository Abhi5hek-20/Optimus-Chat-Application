import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptFriendRequest, getFriendRequests } from "../lib/api.js";
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from "lucide-react";
import NoNotificationsFound from "../components/NoNotificationsFound";
import { useState } from "react";

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const [pendingRequestId, setPendingRequestId] = useState(null);

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: acceptRequestMutation } = useMutation({
    mutationFn: acceptFriendRequest,
    onMutate: (requestId) => {
      setPendingRequestId(requestId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      setPendingRequestId(null);
    },
    onError: () => {
      setPendingRequestId(null);
    },
  });

  const incomingRequests = friendRequests?.incomingReqs || [];
  const acceptedRequests = friendRequests?.acceptedReqs || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen bg-white dark:bg-base-100">
      <div className="container mx-auto max-w-4xl space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">Notifications</h1>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <>
            {incomingRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <UserCheckIcon className="h-5 w-5 text-primary" />
                  Friend Requests
                  <span className="badge badge-primary ml-2">{incomingRequests.length}</span>
                </h2>

                <div className="space-y-3">
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="card bg-white dark:bg-base-200 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-base-300"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="avatar">
                              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-base-300 overflow-hidden">
                                <img src={request.sender.profilePic} alt={request.sender.Fullname} className="w-full h-full object-cover" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold">{request.sender.Fullname}</h3>
                              <p className="text-sm opacity-70">wants to be your friend</p>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm whitespace-nowrap"
                            onClick={() => acceptRequestMutation(request._id)}
                            disabled={pendingRequestId === request._id}
                          >
                            {pendingRequestId === request._id ? (
                              <span className="loading loading-spinner loading-sm"></span>
                            ) : (
                              "Accept"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQS NOTIFICATONS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div key={notification._id} className="card bg-white dark:bg-base-200 shadow-sm border border-gray-200 dark:border-base-300">
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          <div className="avatar mt-1">
                            <div className="w-10 h-10 rounded-full bg-base-300 overflow-hidden">
                              <img
                                src={notification.sender.profilePic}
                                alt={notification.sender.Fullname}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{notification.sender.Fullname}</h3>
                            <p className="text-sm my-1">
                              {notification.sender.Fullname} accepted your friend request
                            </p>
                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="badge badge-success text-xs">
                              <MessageSquareIcon className="h-3 w-3 mr-1" />
                              New Friend
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  );
};
export default NotificationsPage;