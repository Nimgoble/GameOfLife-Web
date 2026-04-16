export interface UploadBoardRequest { cells: boolean[][] }
export interface UploadBoardResponse { id: string }
export interface BoardStateResponse {
  id: string
  cells: boolean[][]
  rows: number
  columns: number
  createdAt: string
}

export interface BoardSummaryResponse {
  id: string
  rows: number
  columns: number
  createdAt: string
}

export interface ErrorResponse {
  code: string
  message: string
  errors?: Record<string, string[]>
}

async function checkResponse(res: Response) {
  if (res.ok) return res.json().catch(() => null)
  const text = await res.text()
  try {
    const err = JSON.parse(text) as ErrorResponse
    const msg = err.message ?? err.code ?? text
    throw new Error(msg)
  } catch {
    throw new Error(text || res.statusText)
  }
}

export async function uploadBoard(baseUrl: string, cells: boolean[][]): Promise<UploadBoardResponse> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/boards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cells })
  })
  return (await checkResponse(res)) as UploadBoardResponse
}

export async function getNextState(baseUrl: string, id: string): Promise<BoardStateResponse> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/boards/${id}/next`)
  return (await checkResponse(res)) as BoardStateResponse
}

export async function listBoards(baseUrl: string): Promise<BoardSummaryResponse[]> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/boards`)
  return (await checkResponse(res)) as BoardSummaryResponse[]
}
export async function getBoard(baseUrl: string, id: string): Promise<BoardStateResponse> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/boards/${id}`)
  return (await checkResponse(res)) as BoardStateResponse
}
export async function getNStates(baseUrl: string, id: string, generations: number): Promise<BoardStateResponse> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/boards/${id}/states?generations=${generations}`)
  return (await checkResponse(res)) as BoardStateResponse
}

export async function getFinalState(baseUrl: string, id: string): Promise<BoardStateResponse> {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/boards/${id}/final`)
  return (await checkResponse(res)) as BoardStateResponse
}
