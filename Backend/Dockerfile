# ==============================
# Build stage
# ==============================

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /src

COPY Backend.csproj ./

RUN dotnet restore

COPY . .

RUN dotnet publish \
    Backend.csproj \
    -c Release \
    -o /app/publish \
    --no-restore


# ==============================
# Runtime stage
# ==============================

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:10000
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 10000

ENTRYPOINT ["dotnet", "Backend.dll"]