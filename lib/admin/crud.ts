import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin, apiErrorResponse } from "@/lib/auth-helpers"

type PrismaDelegate = {
  findMany: (args?: any) => Promise<any>
  findUnique: (args: any) => Promise<any>
  create: (args: any) => Promise<any>
  update: (args: any) => Promise<any>
  delete: (args: any) => Promise<any>
  upsert: (args: any) => Promise<any>
}

function badRequest(error: unknown) {
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: error.issues },
      { status: 400 },
    )
  }
  return apiErrorResponse(error)
}

export function listHandlers<TCreate extends z.ZodTypeAny>(opts: {
  delegate: PrismaDelegate
  orderBy?: unknown
  createSchema: TCreate
  include?: unknown
  where?: unknown
}) {
  const { delegate, orderBy = { orden: "asc" }, createSchema, include, where } = opts

  return {
    GET: async () => {
      try {
        await requireAdmin()
        const items = await delegate.findMany({ orderBy, include, where })
        return NextResponse.json(items)
      } catch (e) {
        return apiErrorResponse(e)
      }
    },
    POST: async (req: NextRequest) => {
      try {
        await requireAdmin()
        const body = await req.json()
        const data = createSchema.parse(body)
        const created = await delegate.create({ data })
        return NextResponse.json(created, { status: 201 })
      } catch (e) {
        return badRequest(e)
      }
    },
  }
}

export function itemHandlers<TUpdate extends z.ZodTypeAny>(opts: {
  delegate: PrismaDelegate
  updateSchema: TUpdate
}) {
  const { delegate, updateSchema } = opts

  return {
    GET: async (_req: NextRequest, { params }: { params: { id: string } }) => {
      try {
        await requireAdmin()
        const item = await delegate.findUnique({ where: { id: params.id } })
        if (!item) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
        return NextResponse.json(item)
      } catch (e) {
        return apiErrorResponse(e)
      }
    },
    PUT: async (req: NextRequest, { params }: { params: { id: string } }) => {
      try {
        await requireAdmin()
        const body = await req.json()
        const data = updateSchema.parse(body)
        const updated = await delegate.update({ where: { id: params.id }, data })
        return NextResponse.json(updated)
      } catch (e) {
        return badRequest(e)
      }
    },
    DELETE: async (_req: NextRequest, { params }: { params: { id: string } }) => {
      try {
        await requireAdmin()
        await delegate.delete({ where: { id: params.id } })
        return NextResponse.json({ ok: true })
      } catch (e) {
        return apiErrorResponse(e)
      }
    },
  }
}

export function singletonHandlers<TUpdate extends z.ZodTypeAny>(opts: {
  delegate: PrismaDelegate
  updateSchema: TUpdate
  defaultId?: string
  createDefaults?: Record<string, unknown>
}) {
  const { delegate, updateSchema, defaultId = "default", createDefaults = {} } = opts

  return {
    GET: async () => {
      try {
        await requireAdmin()
        let item = await delegate.findUnique({ where: { id: defaultId } })
        if (!item) {
          item = await delegate.create({ data: { id: defaultId, ...createDefaults } })
        }
        return NextResponse.json(item)
      } catch (e) {
        return apiErrorResponse(e)
      }
    },
    PUT: async (req: NextRequest) => {
      try {
        await requireAdmin()
        const body = await req.json()
        const data = updateSchema.parse(body)
        const updated = await delegate.upsert({
          where: { id: defaultId },
          create: { id: defaultId, ...createDefaults, ...data },
          update: data,
        })
        return NextResponse.json(updated)
      } catch (e) {
        return badRequest(e)
      }
    },
  }
}
