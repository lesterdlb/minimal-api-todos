FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine3.22 AS base

WORKDIR /app

EXPOSE 8081
EXPOSE 8080

ENV ASPNETCORE_URLS=http://+:8081

FROM mcr.microsoft.com/dotnet/sdk:9.0-alpine3.22 AS build

WORKDIR /src

COPY ["todos-api/todos-api.csproj", "todos-api/"]

RUN dotnet restore "todos-api/todos-api.csproj" --verbosity minimal

COPY . .
WORKDIR "/src/todos-api"

RUN dotnet build "todos-api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "todos-api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "todos-api.dll"]