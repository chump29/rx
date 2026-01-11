# <img src="./frontend/public/rxtrax.png" title="RxTrax logo" height="64" /> RxTrax

* Choose prescription medications and dosage
* Data will be stored in a SQLite database
* Detailed information will be displayed

# Compose flowchart

```mermaid
flowchart LR
frontend@{shape: rounded, label: "frontend"}
frontendPort@{shape: rounded, label: "http://localhost:90"}
backend@{shape: rounded, label: "backend (direct)"}
backendPort@{shape: rounded, label: "http://localhost:5556"}
frontend-->frontendPort
backend-->backendPort
```

---

# Development stuff

### Backend:

```bash
cd backend
pip-compile --extra dev
pip-sync
python api.py &
```

### Frontend:

```bash
cd frontend
pnpm i
pnpm run build:dev
```

# Docker stuff

### To build images:

```bash
# All
./build.sh

# Backend
cd backend && ./build.sh

# Frontend
cd frontend && ./build.sh
```