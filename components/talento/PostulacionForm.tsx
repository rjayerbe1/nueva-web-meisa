"use client"

import { useRef, useState } from "react"
import { ArrowRight, Check, Loader2, Upload } from "lucide-react"

const INPUT_CLS =
  "w-full rounded-none border border-slate-300 bg-white px-4 py-3 font-lato text-sm text-slate-950 placeholder:text-slate-400 focus:border-slate-950 focus:outline-none focus:ring-0 transition-colors"

const LABEL_CLS =
  "mb-1.5 block font-lato text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600"

export function PostulacionForm({
  vacanteSlug,
  vacanteTitulo,
  textoConsentimiento,
}: {
  vacanteSlug?: string
  vacanteTitulo?: string
  textoConsentimiento: string
}) {
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [telefono, setTelefono] = useState("")
  const [ciudad, setCiudad] = useState("")
  const [codigoReferido, setCodigoReferido] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [consentimiento, setConsentimiento] = useState(false)
  const [banco, setBanco] = useState(false)
  const [sitioWeb, setSitioWeb] = useState("") // honeypot
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const onPickFile = (f: File | null) => {
    if (f && f.size > 5 * 1024 * 1024) {
      setError("El archivo supera 5 MB")
      return
    }
    setError(null)
    setCvFile(f)
  }

  const puedeEnviar =
    nombre.trim().length >= 2 &&
    email.includes("@") &&
    telefono.trim().length >= 7 &&
    cvFile !== null &&
    consentimiento &&
    !enviando

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!puedeEnviar || !cvFile) return
    setEnviando(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", cvFile)
      const up = await fetch("/api/talento/cv-upload", { method: "POST", body: fd })
      const upData = await up.json()
      if (!up.ok) throw new Error(upData.error ?? "Error subiendo la hoja de vida")

      const res = await fetch("/api/talento/postular", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          ciudad: ciudad.trim() || null,
          vacanteSlug: vacanteSlug ?? null,
          codigoReferido: codigoReferido.trim() || null,
          consentimiento: true,
          consentimientoBanco: banco,
          cvPathGcs: upData.pathGcs,
          cvFileName: upData.fileName,
          cvContentType: upData.contentType,
          cvSize: upData.size,
          sitioWeb,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error enviando la postulación")
      setEnviado(true)
    } catch (err: any) {
      setError(err.message ?? "Error enviando la postulación")
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="border border-slate-200 bg-white px-8 py-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-slate-950">
          <Check className="h-6 w-6 text-white" />
        </div>
        <h3 className="font-bebas text-3xl uppercase leading-tight text-slate-950">
          Hoja de vida recibida
        </h3>
        <p className="mx-auto mt-2 max-w-md font-lato text-sm leading-relaxed text-slate-600">
          Te enviamos un correo de confirmación a <strong>{email}</strong>. Si tu perfil
          avanza, el equipo de Talento Humano te contactará.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={enviar} className="border border-slate-200 bg-white p-6 md:p-10">
      {vacanteTitulo && (
        <p className="mb-6 border-b border-slate-200 pb-4 font-lato text-sm text-slate-600">
          Postulación a:{" "}
          <span className="font-bold uppercase tracking-wide text-slate-950">
            {vacanteTitulo}
          </span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <label className={LABEL_CLS} htmlFor="pf-nombre">
            Nombre completo *
          </label>
          <input
            id="pf-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className={INPUT_CLS}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="pf-email">
            Correo electrónico *
          </label>
          <input
            id="pf-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={INPUT_CLS}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="pf-telefono">
            Teléfono / WhatsApp *
          </label>
          <input
            id="pf-telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className={INPUT_CLS}
            autoComplete="tel"
            required
          />
        </div>
        <div>
          <label className={LABEL_CLS} htmlFor="pf-ciudad">
            Ciudad
          </label>
          <input
            id="pf-ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            className={INPUT_CLS}
            autoComplete="address-level2"
          />
        </div>
        <div className="md:col-span-2">
          <label className={LABEL_CLS} htmlFor="pf-referido">
            Código de referido (opcional)
          </label>
          <input
            id="pf-referido"
            value={codigoReferido}
            onChange={(e) => setCodigoReferido(e.target.value.toUpperCase())}
            placeholder="Ej: JUANP482"
            className={INPUT_CLS}
          />
          <p className="mt-1.5 font-lato text-xs italic text-slate-500">
            ¿Un colaborador de MEISA te compartió su código? Ingrésalo aquí.
          </p>
        </div>

        {/* Honeypot — invisible para humanos */}
        <input
          type="text"
          value={sitioWeb}
          onChange={(e) => setSitioWeb(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div className="md:col-span-2">
          <label className={LABEL_CLS}>Hoja de vida (PDF o Word, máx. 5 MB) *</label>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 border border-slate-950/30 px-6 py-3 font-lato text-xs font-bold uppercase tracking-wider text-slate-950 transition-colors hover:border-slate-950 hover:bg-slate-950 hover:text-white"
          >
            <Upload className="h-4 w-4" />
            {cvFile ? "Cambiar archivo" : "Adjuntar hoja de vida"}
          </button>
          {cvFile && (
            <span className="ml-3 font-lato text-sm text-slate-600">
              {cvFile.name}{" "}
              <span className="text-slate-400">
                ({(cvFile.size / 1024 / 1024).toFixed(1)} MB)
              </span>
            </span>
          )}
        </div>

        <div className="space-y-4 md:col-span-2">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consentimiento}
              onChange={(e) => setConsentimiento(e.target.checked)}
              className="mt-1 h-4 w-4 flex-shrink-0 accent-slate-950"
              required
            />
            <span className="font-lato text-xs leading-relaxed text-slate-600">
              {textoConsentimiento}{" "}
              <a
                href="/politica-datos"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-slate-950 underline"
              >
                Ver política de tratamiento de datos
              </a>
              . *
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={banco}
              onChange={(e) => setBanco(e.target.checked)}
              className="mt-1 h-4 w-4 flex-shrink-0 accent-slate-950"
            />
            <span className="font-lato text-xs leading-relaxed text-slate-600">
              Autorizo adicionalmente a MEISA a conservar mi hoja de vida en su banco de
              talento para tenerme en cuenta en vacantes futuras. (Opcional)
            </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-5 border border-red-300 bg-red-50 px-4 py-3 font-lato text-sm text-red-800">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!puedeEnviar}
        className="group mt-8 inline-flex items-center justify-center gap-3 bg-red-600 px-8 py-4 font-lato text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {enviando ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <>
            Enviar postulación
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </button>
    </form>
  )
}
