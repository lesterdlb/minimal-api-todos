FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src
COPY ["todos-api/todos-api.csproj", "todos-api/"]
RUN dotnet restore "todos-api/todos-api.csproj"
COPY . .
WORKDIR "/src/todos-api"
RUN dotnet build "todos-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "todos-api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "todos-api.dll"]