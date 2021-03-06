class MasterCourses::MasterContentTag < ActiveRecord::Base
  # i want to get off content tag's wild ride

  belongs_to :master_template, :class_name => "MasterCourses::MasterTemplate"
  belongs_to :content, :polymorphic => true
  validates_with MasterCourses::TagValidator

  serialize :restrictions, Hash
  validate :require_valid_restrictions

  before_create :set_migration_id

  before_save :mark_touch_content_if_restrictions_tightened
  after_save :touch_content_if_restrictions_tightened

  def set_migration_id
    self.migration_id = self.master_template.migration_id_for(self.content)
  end

  def require_valid_restrictions
    # this may be changed in the future
    if self.restrictions_changed? && (self.restrictions.keys != [:all])
      if (self.restrictions.keys - MasterCourses::LOCK_TYPES).any?
        self.errors.add(:restrictions, "Invalid settings")
      elsif self.restrictions.present? && !self.restrictions[:content]
        self.errors.add(:restrictions, "Content must be restricted if restrictions are present")
      end
    end
  end

  def mark_touch_content_if_restrictions_tightened
    if !self.new_record? && self.restrictions_changed? && self.restrictions.any?{|type, locked| locked && !self.restrictions_was[type]}
      @touch_content = true # set if restrictions for content or settings is true now when it wasn't before so we'll re-export and overwrite any changed content
    end
  end

  def touch_content_if_restrictions_tightened
    if @touch_content
      self.content.touch
      @touch_content = false
    end
  end

  def self.fetch_module_item_restrictions(item_ids)
    # does a silly fancy doublejoin so we can get all the restrictions in one query
    data = self.
      joins("INNER JOIN #{MasterCourses::ChildContentTag.quoted_table_name} ON
          #{self.table_name}.migration_id=#{MasterCourses::ChildContentTag.table_name}.migration_id").
      joins("INNER JOIN #{ContentTag.quoted_table_name} ON
          #{MasterCourses::ChildContentTag.table_name}.content_type=#{ContentTag.table_name}.content_type AND
          #{MasterCourses::ChildContentTag.table_name}.content_id=#{ContentTag.table_name}.content_id").
      where(:content_tags => {:id => item_ids}).
      pluck('content_tags.id', :restrictions)
    Hash[data]
  end
end
