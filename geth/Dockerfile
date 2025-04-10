FROM golang:1.22 AS op

WORKDIR /app

ENV REPO=https://github.com/ethereum-optimism/optimism.git
ENV VERSION=v1.13.0
ENV COMMIT=5f003211aed7469eed7df666291a62c025d1c46c

# Clone the repository and checkout the specific version
RUN git clone $REPO --branch $VERSION --single-branch . && \
    git switch -c branch-$VERSION && \
    bash -c '[ "$(git rev-parse HEAD)" = "$COMMIT" ]'

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    make \
    gcc \
    git

# Copy customized gossip code
COPY geth/gossip/gossip.go /app/op-node/p2p/gossip.go

# Build op-node
RUN cd op-node && \
    go mod download && \
    go build -o bin/op-node ./cmd/main.go

FROM golang:1.22 AS geth

WORKDIR /app

RUN apt-get update && \
    apt-get install -y \
    build-essential

ENV REPO=https://github.com/ethereum-optimism/op-geth.git
ENV VERSION=v1.101503.2
ENV COMMIT=37be9e05e9d6843619c9bbaabc96abc0ce653f55
RUN git clone $REPO --branch $VERSION --single-branch . && \
    git switch -c branch-$VERSION && \
    bash -c '[ "$(git rev-parse HEAD)" = "$COMMIT" ]'

RUN go run build/ci.go install -static ./cmd/geth

FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y jq curl supervisor && \
    rm -rf /var/lib/apt/lists
RUN mkdir -p /var/log/supervisor

WORKDIR /app

COPY --from=op /app/op-node/bin/op-node ./
COPY --from=geth /app/build/bin/geth ./
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY geth/geth-entrypoint ./execution-entrypoint
COPY op-node-entrypoint .

CMD ["/usr/bin/supervisord"]
