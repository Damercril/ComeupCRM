import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { record } = await req.json()

    // Vérifier que nous avons reçu un enregistrement d'invitation
    if (!record || !record.email || !record.workspace_id) {
      return new Response(
        JSON.stringify({ error: 'Invalid payload' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Récupérer les informations du workspace
    const { data: workspace } = await supabaseClient
      .from('workspaces')
      .select('name')
      .eq('id', record.workspace_id)
      .single()

    if (!workspace) {
      return new Response(
        JSON.stringify({ error: 'Workspace not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      )
    }

    // Générer le lien d'invitation
    const inviteUrl = `${Deno.env.get('PUBLIC_APP_URL')}/invite?token=${record.id}`

    // Envoyer l'email
    const { error: emailError } = await supabaseClient.auth.admin.sendRawEmail({
      to: record.email,
      subject: `Invitation à rejoindre ${workspace.name} sur SAGT CRM`,
      html: `
        <h2>Vous avez été invité à rejoindre ${workspace.name} sur SAGT CRM</h2>
        <p>Vous avez été invité en tant que ${record.role === 'admin' ? 'administrateur' : 'opérateur'}.</p>
        <p>Pour accepter l'invitation, veuillez cliquer sur le lien ci-dessous :</p>
        <p>
          <a href="${inviteUrl}" style="
            display: inline-block;
            background-color: #38BDF8;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 16px 0;
          ">
            Accepter l'invitation
          </a>
        </p>
        <p>Si vous n'avez pas de compte, vous serez invité à en créer un.</p>
        <p>Ce lien expirera dans 7 jours.</p>
      `
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})