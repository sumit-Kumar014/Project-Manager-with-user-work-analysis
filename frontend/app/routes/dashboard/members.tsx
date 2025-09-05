import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Workspace } from "types";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useGetWorkspaceDetailsQuery } from "hooks/use-workspace";
import Loader from "@/components/ui/loader";
import { useDebounce } from "use-debounce";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const workspaceId = searchParams.get("workspaceId");
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch] = useDebounce(search, 300); 

  const [activeTab, setActiveTab] = useState("list");

  // sync URL params only after debounce
  useEffect(() => {
    if (!workspaceId) return;
    setSearchParams(
      {
        workspaceId,
        search: debouncedSearch,
      },
      { replace: true }
    );
  }, [debouncedSearch, workspaceId]);

  const { data, isLoading } = useGetWorkspaceDetailsQuery(workspaceId!) as {
    data: Workspace;
    isLoading: boolean;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader />
      </div>
    );

  if (!data || !workspaceId) return <div>No Members found</div>;

  const filteredMembers = data?.members?.filter(
    (member) =>
      member.user.name.toLowerCase().includes(search.toLowerCase()) ||
      member.user.email.toLowerCase().includes(search.toLowerCase()) ||
      member.role?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <h1 className="text-2xl font-bold">Workspace Members</h1>
      </div>

      <Input
        placeholder="Search members ...."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        {activeTab === "list" && (
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <CardTitle>Members</CardTitle>
                <CardDescription>
                  {filteredMembers?.length} members in your workspace
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="divide-y">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex flex-col md:flex-row items-center justify-between p-4 gap-3"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="bg-gray-500">
                          <AvatarImage src={member.user.profilePicture} />
                          <AvatarFallback>
                            {member.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-sm text-gray-500">
                            {member.user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 ml-11 md:ml-0">
                        <Badge
                          variant={
                            ["admin", "owner"].includes(member.role)
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {member.role}
                        </Badge>

                        <Badge variant={"outline"}>{data.name}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {activeTab === "board" && (
          <TabsContent value="board">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.user._id}>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="bg-gray-500 size-20 mb-4">
                      <AvatarImage src={member.user.profilePicture} />
                      <AvatarFallback className="uppercase">
                        {member.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-lg font-medium mb-2">
                      {member.user.name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4">
                      {member.user.email}
                    </p>

                    <Badge
                      variant={
                        ["admin", "owner"].includes(member.role)
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {member.role}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default Members;
