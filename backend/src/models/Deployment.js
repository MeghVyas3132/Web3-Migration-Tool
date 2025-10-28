const supabase = require('../config/supabase');

class Deployment {
  static async create(deploymentData) {
    const { data, error } = await supabase
      .from('deployments')
      .insert([
        {
          user_id: deploymentData.userId,
          subdomain: deploymentData.subdomain.toLowerCase(),
          ipfs_cid: deploymentData.ipfsCID,
          framework: deploymentData.framework,
          build_command: deploymentData.buildCommand || '',
          github_url: deploymentData.githubUrl || '',
          branch: deploymentData.branch || 'main',
          status: deploymentData.status || 'building',
          uptime: 100,
          last_pinged: new Date().toISOString(),
          total_visits: 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return this.formatDeployment(data);
  }

  static async find(query) {
    let supabaseQuery = supabase
      .from('deployments')
      .select('*')
      .order('created_at', { ascending: false });

    if (query.userId) {
      supabaseQuery = supabaseQuery.eq('user_id', query.userId);
    }

    const { data, error } = await supabaseQuery;

    if (error) throw error;
    return data.map(this.formatDeployment);
  }

  static async findOne(query) {
    let supabaseQuery = supabase.from('deployments').select('*');

    if (query._id) {
      supabaseQuery = supabaseQuery.eq('id', query._id);
    }
    if (query.userId) {
      supabaseQuery = supabaseQuery.eq('user_id', query.userId);
    }
    if (query.subdomain) {
      supabaseQuery = supabaseQuery.eq('subdomain', query.subdomain.toLowerCase());
    }

    const { data, error } = await supabaseQuery.single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatDeployment(data) : null;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('deployments')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return this.formatDeployment(data);
  }

  static async deleteOne(query) {
    let supabaseQuery = supabase.from('deployments').delete();

    if (query._id) {
      supabaseQuery = supabaseQuery.eq('id', query._id);
    }
    if (query.userId) {
      supabaseQuery = supabaseQuery.eq('user_id', query.userId);
    }

    const { error } = await supabaseQuery;

    if (error) throw error;
    return { deletedCount: 1 };
  }

  static formatDeployment(data) {
    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      subdomain: data.subdomain,
      ipfsCID: data.ipfs_cid,
      framework: data.framework,
      buildCommand: data.build_command,
      githubUrl: data.github_url,
      branch: data.branch,
      status: data.status,
      metrics: {
        uptime: data.uptime,
        lastPinged: data.last_pinged,
        totalVisits: data.total_visits,
      },
      buildLogs: data.build_logs,
      errorMessage: data.error_message,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

module.exports = Deployment;
